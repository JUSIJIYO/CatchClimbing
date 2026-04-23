import React from 'react';
import styles from '../../styles/css/branch/BranchDetail.module.css';
import locationIcon from '../../assets/icon/location1.svg';
import phoneIcon from '../../assets/icon/phoneNumber.svg';
import instagramIcon from '../../assets/icon/instagram.svg';
import timeIcon from '../../assets/icon/time.svg';
import starIcon from '../../assets/icon/star.svg';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

function BranchDetail({ branch }) {
  const getInstaId = (url) => {
    if (!url) return '';

    const match = url.match(/instagram\.com\/([^/?]+)/);
    return match ? match[1] : url.replace('@', '');
  };
  const [branchData, setBranchData] = useState(branch);
  useEffect(() => {
    const fetchBranchDetail = async () => {
      try {
        const ref = doc(db, 'branches', branch.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setBranchData(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (branch?.id) fetchBranchDetail();
  }, [branch]);

  const lat = Number(branchData.latitude ?? branchData.latitud);

  const lng = Number(
    branchData.longitude ?? branchData.longtitude ?? branchData.logitude
  );

  // console.log('lat:', lat, typeof lat);
  // console.log('lng:', lng, typeof lng);

  const coords = !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
  const [rating, setRating] = useState(0);
  useEffect(() => {
    // console.log('branch 전체:', branch);
    // console.log('branch.id:', branch?.id);
    const fetchRating = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('branchId', '==', branch.id)
        );

        const snapshot = await getDocs(q);

        // console.log('리뷰 개수:', snapshot.size);

        if (snapshot.empty) {
          setRating(0);
          return;
        }

        let total = 0;

        snapshot.forEach((doc) => {
          // console.log('각 리뷰:', doc.data());
          total += doc.data().rating || 0;
        });

        const avg = total / snapshot.size;

        // console.log('평균:', avg);

        setRating(avg.toFixed(1)); // 소수점 1자리
      } catch (e) {
        console.error('평점 가져오기 실패:', e);
      }
    };

    if (branch?.id) fetchRating();
  }, [branch]);

  return (
    <section className={styles['card']}>
      <div className={styles['map']}>
        {coords ? (
          <Map
            center={coords}
            style={{ width: '100%', height: '100%' }}
            level={4}
          >
            <MapMarker position={coords} />
          </Map>
        ) : (
          <div className={styles['noMap']}>지도 정보가 없습니다</div>
        )}
      </div>

      <div className={styles['infoList']}>
        <div className={styles['item']}>
          <img src={locationIcon} alt="" />
          <div>
            <p className={styles['label']}>주소</p>
            <p className={styles['address']}>{branchData.address}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={phoneIcon} alt="" />
          <div>
            <p className={styles['label']}>전화번호</p>
            <p>{branchData.phone}</p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={instagramIcon} alt="" />
          <div>
            <p className={styles['label']}>인스타그램</p>

            {branchData.instagram && (
              <a
                href={
                  branchData.instagram.startsWith('http')
                    ? branchData.instagram
                    : `https://instagram.com/${branchData.instagram.replace(
                        '@',
                        ''
                      )}`
                }
              >
                @{getInstaId(branchData.instagram)}
              </a>
            )}
          </div>
        </div>

        <div className={styles['item']}>
          <img src={timeIcon} alt="" />
          <div>
            <p className={styles['label']}>운영시간</p>
            <p className={styles['branch-time']}>
              {branchData.openHours?.replace(
                /토요일\s*,\s*일요일\s*,\s*공휴일/,
                '\n주말/공휴일 '
              )}
            </p>
          </div>
        </div>

        <div className={styles['item']}>
          <img src={starIcon} alt="" />
          <div>
            <p className={styles['label']}>평점</p>
            <p>
              {rating}
              <span className={styles['total']}> / 5.0</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchDetail;
