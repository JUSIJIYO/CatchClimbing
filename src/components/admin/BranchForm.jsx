import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/css/admin/BranchForm.module.css";
import adminBranchSign from "../../assets/icon/adminBranchSign.svg";
import adminBranchPhone from "../../assets/icon/adminBranchPhone.svg";
import adminBranchLocation from "../../assets/icon/adminBranchLocation.svg";
import adminBranchClock from "../../assets/icon/adminBranchClock.svg";
import adminBranchInsta from "../../assets/icon/adminBranchInsta.svg";

// 우편번호 스크립트
// 비동기 설정을 통해 팝업을 사용할 떄만 작동할 수있게 설정
async function loadDaumPostcode() {
  // 이미 스크립트가 로드 되어 있다면 넘어갈 수 있게 설정
  if (window.daum?.Postcode) {
    return;
  }

  await new Promise((resolve) => {
    const script = document.createElement("script");
    // 우편번호 스크립트 경로
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    // 스크립트 로드 완료시 resolve
    script.onload = resolve;
    // head에 삽입
    document.head.appendChild(script);
  });
}

// 카카오맵 주소를 좌표로 변환하기
// 카카오 geocoder는 콜백 기반 API라 비동기 처리를 위해 Promise 사용
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    // 카카오맵 SDK가 제공하는 지오코더 객체 생성 (주소 문자열 위경도 좌표로 변환)
    const geocoder = new window.kakao.maps.services.Geocoder();
    // 검색이 끝나면 결과배열과 상태(성공, 실패여부)를 받음
    geocoder.addressSearch(address, (results, status) => {
      // Status가 OK가 아니면 (검색결과 X or API 오류) 실패처리(reject)
      if (status !== window.kakao.maps.services.Status.OK) {
        reject(new Error("주소 검색 실패"));
        return;
      }
      // 검색 성공시 순서대로 위도, 경도 좌표를 let, lng에 저장 parseFloat를 통해 문자열로 오는 좌표값 숫자로 변환
      resolve({ lat: parseFloat(results[0].y), lng: parseFloat(results[0].x) });
    });
  });
}

function BranchForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // 수정인지 신청인지 판단
  const editBranch = location.state?.branch ?? null;

  // 이미지 미리보기 상태 관리
  const [imagePreview, setImagePreview] = useState(null);

  // 이미지 파일 상태 관리
  const [imageFile, setImageFile] = useState(null);

  // 카카오맵 검색 성공시 저장한 let, lng 좌표 상태 관리
  const [coords, setCoords] = useState(null);

  // 지도 에러 메시지 상태 관리
  const [mapError, setMapError] = useState("");

  // 제출 상태 관리
  const [submitting, setSubmitting] = useState(false);

  // 폼 입력값 상태 관리
  const [form, setForm] = useState({
    branchName: "",
    phone: "",
    address: "",
    openHours: "",
    instagram: "",
  });

  // 수정시에 초기값 세팅
  useEffect(() => {
    if (editBranch) {
      setForm({
        branchName: editBranch.name ?? "",
        phone: editBranch.phone ?? "",
        address: editBranch.address ?? "",
        openHours: editBranch.openHours ?? "",
        instagram: editBranch.instagram ?? "",
      });
      if (editBranch.image) setImagePreview(editBranch.image);
      if (editBranch.latitude && editBranch.longtitude) {
        setCoords({ lat: editBranch.latitude, lng: editBranch.longtitude });
      }
    }
  }, []);

  // 파일 업로드시 파일 미리보기 처리 함수
  const handleImageChange = (e) => {
    // 업로드한 첫번째 파일 가져오기
    const file = e.target.files[0];
    // 업로드 하지 않고 취소시 그대로 반환
    if (!file) {
      return;
    }
    setImageFile(file);
    // 파일 읽기 API
    const reader = new FileReader();
    // 파일 읽기 완료시 실행
    reader.onload = (item) => setImagePreview(item.target.result);
    // 파일 읽기 시작
    reader.readAsDataURL(file);
  };

  // input에 입력시 바뀌는 값 변경 관리 함수
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 취소 버튼 클릭시 함수
  const handleCancel = () => {
    if (editBranch) {
      navigate(-1);
    } else {
      setForm({
        branchName: "",
        phone: "",
        address: "",
        openHours: "",
        instagram: "",
      });
      setImagePreview(null);
      setImageFile(null);
      setCoords(null);
      setMapError("");
    }
  };

  // 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 유효성 검사
    if (!form.branchName || !form.phone || !form.address || !form.openHours) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      // 이미지 url 처리 수정할때는 기존 이미지 없을 때는 빈값(추가할 수 있게)
      let imageUrl = editBranch?.image ?? "";
      if (imageFile) {
        // firestore에 저장할 경로 설정 
        const storageRef = ref(storage, `branches/${currentUser.uid}/${Date.now()}`);
        // 이미지 파일 firesotre에 업로드
        const snapshot = await uploadBytes(storageRef, imageFile);
        // 업로드 이미지 다운로드 URL 저장 (이미지 표시)
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // firebase에 보낼 데이터
      const branchData = {
        name: form.branchName,
        phone: form.phone,
        address: form.address,
        openHours: form.openHours,
        instagram: form.instagram,
        image: imageUrl,
        latitude: coords?.lat ?? null,
        longtitude: coords?.lng ?? null,
        adminId: currentUser.uid,
      };

      // firebase 연동 함수
      // 수정 모드일때
      if (editBranch) {
        // 지점 정보 업데이트
        await updateDoc(doc(db, "branches", editBranch.id), branchData);
      } else {
        // 신규 생성할 때
        // 지점 정보 추가
        await addDoc(collection(db, "branches"), {
          ...branchData,
          status: "pending",
          rating: 0,
          createdAt: serverTimestamp(),
          joinAt: null,
        });
      }

      navigate("/admin/branchmanage");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 다음 우편번호 팝업 코드
  const openDaumPostcode = async () => {
    // 비동기 설정
    await loadDaumPostcode();
    // 우편번호 API 생성
    new window.daum.Postcode({
      // 주소 선택시 실행 ( 비동기 설정 )
      oncomplete: async (data) => {
        // 도로명 주소있을시 사용 없을시 지번 주소만 사용
        const address = data.roadAddress || data.jibunAddress;
        // 설정된 주소 업데이트
        setForm((item) => ({ ...item, address }));
        // 에러메시지 초기화
        setMapError("");
        try {
          // 위에서 작성한 주소 좌표로 변환하는 함수 호출
          const result = await geocodeAddress(address);
          setCoords(result);
        } catch (err) {
          setMapError(err.message);
        }
      },
      // 우편번호 입력 팝업 열기
    }).open();
  };

  return (
    <div className={styles["branchForm-ct"]}>
      <div className={styles["branchForm-header-ct"]}>
        <h2>{editBranch ? "지점 수정" : "지점 신청"}</h2>
        <p>지점 정보를 입력하고 {editBranch ? "수정" : "신청"}하세요</p>
      </div>

      <div className={styles["branchForm-form-ct"]}>
        <div>
          <label className={styles["branchForm-form-title"]}>지점 이미지</label>
          <label
            htmlFor="branchImageInput"
            className={styles["branchForm-form-image-ct"]}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" />
            ) : (
              <>
                <img src={adminBranchSign} />
                <p>클릭하여 이미지를 업로드하세요</p>
                <span>PNG, JPG, WEBP (최대 10MB)</span>
              </>
            )}
          </label>
          <input
            id="branchImageInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles["branchForm-middle-ct"]}>
          <div>
            <label className={styles["branchForm-form-title"]}>
              지점명
              <span className={styles["branchForm-form-star"]}>*</span>
            </label>
            <input
              className={styles["branchForm-common-input"]}
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              placeholder="지점명 입력"
            />
          </div>
          <div>
            <label className={styles["branchForm-form-title"]}>
              연락처
              <span className={styles["branchForm-form-star"]}>*</span>
            </label>
            <div className={styles["branchForm-input-ct"]}>
              <p className={styles["branchForm-input-icon"]}>
                <img src={adminBranchPhone} />
              </p>
              <input
                className={`${styles["branchForm-common-input"]}`}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="지점 전화번호 입력"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={styles["branchForm-form-title"]}>
            주소
            <span className={styles["branchForm-form-star"]}>*</span>
          </label>
          <div className={styles["branchForm-input-ct"]}>
            <span className={styles["branchForm-input-icon"]}>
              <img src={adminBranchLocation} />
            </span>
            <input
              className={`${styles["branchForm-common-input"]}`}
              name="address"
              value={form.address}
              readOnly
              placeholder="클릭하여 주소 검색"
              onClick={openDaumPostcode}
            />
          </div>
        </div>

        <div>
          <label className={styles["branchForm-form-title"]}>위치 확인</label>
          <div
            className={`${styles["barnchForm-form-map-ct"]} ${coords ? ` ${styles["branchForm-form-map-active"]}` : ""}`}
            onClick={!coords ? openDaumPostcode : undefined}
          >
            {coords ? (
              // 카카오맵
              <Map
                center={coords}
                style={{ width: "100%", height: "100%" }}
                level={4} // 확대 비율
              >
                {/* 마커 위치 */}
                <MapMarker position={coords} />
              </Map>
            ) : (
              <>
                <img src={adminBranchLocation} />
                <p>{mapError || "주소를 입력하면 지도가 표시됩니다"}</p>
              </>
            )}
          </div>
          {coords && (
            <button
              className={styles["branchForm-form-address-research"]}
              onClick={openDaumPostcode}
            >
              주소 재검색
            </button>
          )}
        </div>

        <div>
          <label className={styles["branchForm-form-title"]}>
            영업시간
            <span className={styles["branchForm-form-star"]}>*</span>
          </label>
          <div className={styles["branchForm-input-ct"]}>
            <span className={styles["branchForm-input-icon"]}>
              <img src={adminBranchClock} />
            </span>
            <textarea
              className={styles["branchForm-common-input"]}
              name="openHours"
              value={form.openHours}
              onChange={handleChange}
              placeholder={`영업 시간 입력\nex)\n평일 08:00 ~ 23:00\n주말 08:00 ~ 22:00`}
              rows={4}
            />
          </div>
        </div>

        <div>
          <label className={styles["branchForm-form-title"]}>Instagram</label>
          <div className={styles["branchForm-input-ct"]}>
            <span className={styles["branchForm-input-icon"]}>
              <img src={adminBranchInsta} />
            </span>
            <input
              className={`${styles["branchForm-common-input"]}`}
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="@insta_id"
            />
          </div>
        </div>

        <div className={styles["branchForm-submit-button-ct"]}>
          <button
            className={styles["branchForm-submit-cancel-button"]}
            onClick={handleCancel}
            disabled={submitting}
          >
            취소
          </button>
          <button
            className={styles["branchForm-submit-submit-button"]}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "저장 중..." : editBranch ? "수정하기" : "신청하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BranchForm;
