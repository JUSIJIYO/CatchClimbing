// import { db } from "../firebase/config";
// import { collection, addDoc } from "firebase/firestore";

// export const seedCommunity = async () => {
//   try {
//     const posts = [
//       {
//         branchId: "theclimb_gangnam",
//         authorId: "user_001",
//         authorName: "김클라이머",
//         isAnonymous: false,
//         title: "강남점 오늘 세팅 구역 어디인가요?",
//         content: "오후에 방문 예정인데 세팅 끝났는지 궁금합니다!",
//         viewer: 45,
//         commentCount: 2,
//         createdAt: new Date(),
//         isReported: false,
//       },
//       {
//         branchId: "theclimb_hongdae",
//         authorId: "user_002",
//         authorName: "익명회원",
//         isAnonymous: true,
//         title: "홍대점 주차 팁 있나요?",
//         content: "건물 주차장 매번 만차라... 근처 공영주차장 추천 부탁드려요.",
//         viewer: 120,
//         commentCount: 1,
//         createdAt: new Date(),
//         isReported: false,
//       },
//       {
//         branchId: null, // 자유게시판 성격
//         authorId: "user_003",
//         authorName: "장비충",
//         isAnonymous: false,
//         title: "초보용 초크백 브랜드 추천해주세요",
//         content: "가성비 좋은 블랙다이아몬드나 오가닉 중에 고민 중입니다.",
//         viewer: 88,
//         commentCount: 1,
//         createdAt: new Date(),
//         isReported: false,
//       },
//       {
//         branchId: "theclimb_sillim",
//         authorId: "user_004",
//         authorName: "신림홀드",
//         isAnonymous: false,
//         title: "신림점 지구력 벽 난이도 어떤가요?",
//         content: "요즘 지구력이 너무 부족해서 연습하러 가려는데 매운 편인가요?",
//         viewer: 32,
//         commentCount: 1,
//         createdAt: new Date(),
//         isReported: false,
//       },
//       {
//         branchId: null,
//         authorId: "user_005",
//         authorName: "부상조심",
//         isAnonymous: true,
//         title: "손가락 활차 부상인 것 같은데 병원 추천좀요",
//         content: "강남이나 서초 쪽 전문 병원 아시는 분 계신가요?",
//         viewer: 210,
//         commentCount: 0,
//         createdAt: new Date(),
//         isReported: false,
//       },
//     ];

//     // 🔥 1. posts 업로드 + ID 저장
//     const postIds = [];
//     for (const post of posts) {
//       const docRef = await addDoc(collection(db, "posts"), post);
//       postIds.push(docRef.id);
//     }

//     const comments = [
//       {
//         postId: postIds[0], 
//         authorId: "user_006",
//         authorName: "루트세터팬",
//         isAnonymous: false,
//         isProfessor: false,
//         content: "방금 다녀왔는데 컴피벽 쪽 세팅 끝났더라고요!",
//         createdAt: new Date(),
//       },
//       {
//         postId: postIds[0],
//         authorId: "user_007",
//         authorName: "알림봇",
//         isAnonymous: true,
//         isProfessor: false,
//         content: "오후 2시 기준으로 전체 이용 가능합니다.",
//         createdAt: new Date(),
//       },
//       {
//         postId: postIds[1], 
//         authorId: "user_008",
//         authorName: "홍대주민",
//         isAnonymous: false,
//         isProfessor: false,
//         content: "저는 그냥 지하철 타고 가요... 주차 진짜 헬입니다.",
//         createdAt: new Date(),
//       },
//       {
//         postId: postIds[2], 
//         authorId: "user_009",
//         authorName: "장비마스터",
//         isAnonymous: false,
//         isProfessor: true,
//         content: "입문용으로는 오가닉이 디자인도 예쁘고 오래 쓰기 좋습니다.",
//         createdAt: new Date(),
//       },
//       {
//         postId: postIds[3], 
//         authorId: "user_010",
//         authorName: "지구력왕",
//         isAnonymous: false,
//         isProfessor: false,
//         content: "빨강 난이도 기준 다른 지점보다 조금 더 길게 느껴졌어요.",
//         createdAt: new Date(),
//       },
//     ];

//     for (const comment of comments) {
//       await addDoc(collection(db, "comments"), comment);
//     }

//     const reviews = [
//       {
//         branchId: "theclimb_gangnam",
//         classId: "class_101",
//         authorId: "user_011",
//         authorName: "레벨업중",
//         isAnonymous: true,
//         title: "스타터 패키지 강추!",
//         content: "기본기부터 차근차근 알려주셔서 너무 유익했어요.",
//         viewer: 50,
//         professorId: "prof_kim",
//         rating: 5.0,
//         classDate: "2026-03-15",
//         createdAt: new Date(),
//       },
//       {
//         branchId: "theclimb_hongdae",
//         classId: "class_102",
//         authorId: "user_012",
//         authorName: "이다솔",
//         isAnonymous: false,
//         title: "볼더링 레벨 1 수업 후기",
//         content: "무게 중심 이동하는 법을 확실히 배웠습니다.",
//         viewer: 42,
//         professorId: "prof_lee",
//         rating: 4.8,
//         classDate: "2026-04-10",
//         createdAt: new Date(),
//       },
//       {
//         branchId: "theclimb_sillim",
//         classId: "class_103",
//         authorId: "user_013",
//         authorName: "익명",
//         isAnonymous: true,
//         title: "조금 아쉬운 중급반",
//         content: "사람이 너무 많아서 피드백 받을 시간이 부족했어요.",
//         viewer: 35,
//         professorId: "prof_park",
//         rating: 3.5,
//         classDate: "2026-04-12",
//         createdAt: new Date(),
//       },
//       {
//         branchId: "theclimb_gangnam",
//         classId: "class_104",
//         authorId: "user_014",
//         authorName: "다이노장인",
//         isAnonymous: false,
//         title: "다이노 특강 대만족",
//         content: "쫄보였는데 선생님 덕분에 뛰는 법을 알게 됐습니다.",
//         viewer: 66,
//         professorId: "prof_choi",
//         rating: 5.0,
//         classDate: "2026-04-14",
//         createdAt: new Date(),
//       },
//       {
//         branchId: "theclimb_hongdae",
//         classId: "class_105",
//         authorId: "user_015",
//         authorName: "운동조아",
//         isAnonymous: false,
//         title: "친절한 설명 감사합니다",
//         content: "영상 찍어서 자세 교정해주시는 게 큰 도움이 됐어요.",
//         viewer: 28,
//         professorId: "prof_kim",
//         rating: 4.9,
//         classDate: "2026-04-15",
//         createdAt: new Date(),
//       },
//     ];

//     for (const review of reviews) {
//       await addDoc(collection(db, "reviews"), review);
//     }

//     console.log("5개씩 총 15개의 더미 데이터 업로드 완료!");
//   } catch (e) {
//     console.error("업로드 실패:", e);
//   }
// };
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export const seedReviews = async () => {
  try {
      const reviews = [
  // ===================== 이수 =====================
  {
    branchId: "theclimb_isu",
    classId: "class_isu1",
    authorId: "user_016",
    authorName: "이수러버",
    isAnonymous: false,
    title: "이수점 루트 다양해서 좋아요",
    content: "초중급 루트 밸런스가 잘 잡혀있어요.",
    viewer: 55,
    professorId: "prof_kim",
    rating: 4.5,
    classDate: "2026-04-01",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_isu",
    classId: "class_isu2",
    authorId: "user_017",
    authorName: "익명",
    isAnonymous: true,
    title: "시설 깔끔",
    content: "전체적으로 관리가 잘 되어 있는 느낌입니다.",
    viewer: 41,
    professorId: "prof_lee",
    rating: 4.2,
    classDate: "2026-04-02",
    createdAt: new Date(),
  },

  // ===================== 마곡 =====================
  {
    branchId: "theclimb_magok",
    classId: "class_magok1",
    authorId: "user_018",
    authorName: "마곡클라이머",
    isAnonymous: false,
    title: "마곡점 넓고 쾌적함",
    content: "사람 많아도 공간이 넓어서 좋았어요.",
    viewer: 60,
    professorId: "prof_choi",
    rating: 4.6,
    classDate: "2026-04-03",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_magok",
    classId: "class_magok2",
    authorId: "user_019",
    authorName: "익명",
    isAnonymous: true,
    title: "초보 추천",
    content: "처음 시작하기 좋은 지점이에요.",
    viewer: 33,
    professorId: "prof_kim",
    rating: 4.1,
    classDate: "2026-04-04",
    createdAt: new Date(),
  },

  // ===================== 문래 =====================
  {
    branchId: "theclimb_mullae",
    classId: "class_mullae1",
    authorId: "user_020",
    authorName: "문래홀드",
    isAnonymous: false,
    title: "문래점 루트 재미있음",
    content: "동작 다양해서 연습하기 좋습니다.",
    viewer: 72,
    professorId: "prof_lee",
    rating: 4.7,
    classDate: "2026-04-05",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_mullae",
    classId: "class_mullae2",
    authorId: "user_021",
    authorName: "익명",
    isAnonymous: true,
    title: "분위기 좋음",
    content: "전체적으로 분위기 편안합니다.",
    viewer: 48,
    professorId: "prof_park",
    rating: 4.3,
    classDate: "2026-04-06",
    createdAt: new Date(),
  },

  // ===================== 논현 =====================
  {
    branchId: "theclimb_nonhyeon",
    classId: "class_non1",
    authorId: "user_022",
    authorName: "논현러",
    isAnonymous: false,
    title: "논현점 난이도 적당",
    content: "중급자에게 딱 좋은 느낌입니다.",
    viewer: 90,
    professorId: "prof_kim",
    rating: 4.5,
    classDate: "2026-04-07",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_nonhyeon",
    classId: "class_non2",
    authorId: "user_023",
    authorName: "익명",
    isAnonymous: true,
    title: "깔끔하고 조용함",
    content: "사람 많지 않아서 연습하기 좋아요.",
    viewer: 66,
    professorId: "prof_lee",
    rating: 4.4,
    classDate: "2026-04-08",
    createdAt: new Date(),
  },

  // ===================== 사당 =====================
  {
    branchId: "theclimb_sadang",
    classId: "class_sadang1",
    authorId: "user_024",
    authorName: "사당클라",
    isAnonymous: false,
    title: "사당점 루트 재밌음",
    content: "동작이 다양해서 지루하지 않아요.",
    viewer: 80,
    professorId: "prof_choi",
    rating: 4.6,
    classDate: "2026-04-09",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_sadang",
    classId: "class_sadang2",
    authorId: "user_025",
    authorName: "익명",
    isAnonymous: true,
    title: "시설 관리 좋음",
    content: "홀드 상태가 전체적으로 깔끔합니다.",
    viewer: 53,
    professorId: "prof_kim",
    rating: 4.3,
    classDate: "2026-04-10",
    createdAt: new Date(),
  },

  // ===================== 신사 =====================
  {
    branchId: "theclimb_sinsa",
    classId: "class_sinsa1",
    authorId: "user_026",
    authorName: "신사러버",
    isAnonymous: false,
    title: "신사점 감성 최고",
    content: "인테리어 예쁘고 분위기 좋아요.",
    viewer: 110,
    professorId: "prof_lee",
    rating: 4.8,
    classDate: "2026-04-11",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_sinsa",
    classId: "class_sinsa2",
    authorId: "user_027",
    authorName: "익명",
    isAnonymous: true,
    title: "루트 난이도 좋음",
    content: "초중급 밸런스 잘 맞음.",
    viewer: 74,
    professorId: "prof_park",
    rating: 4.5,
    classDate: "2026-04-12",
    createdAt: new Date(),
  },

  // ===================== 양재 =====================
  {
    branchId: "theclimb_yangjae",
    classId: "class_yang1",
    authorId: "user_028",
    authorName: "양재홀드",
    isAnonymous: false,
    title: "양재점 조용해서 좋음",
    content: "연습 집중하기 좋아요.",
    viewer: 58,
    professorId: "prof_kim",
    rating: 4.4,
    classDate: "2026-04-13",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_yangjae",
    classId: "class_yang2",
    authorId: "user_029",
    authorName: "익명",
    isAnonymous: true,
    title: "초보 친화적",
    content: "입문자에게 추천합니다.",
    viewer: 39,
    professorId: "prof_lee",
    rating: 4.2,
    classDate: "2026-04-14",
    createdAt: new Date(),
  },

  // ===================== 연남 =====================
  {
    branchId: "theclimb_yeonnam",
    classId: "class_yeon1",
    authorId: "user_030",
    authorName: "연남클라이머",
    isAnonymous: false,
    title: "연남점 분위기 최고",
    content: "감성+운동 둘 다 잡았어요.",
    viewer: 125,
    professorId: "prof_choi",
    rating: 4.9,
    classDate: "2026-04-15",
    createdAt: new Date(),
  },
  {
    branchId: "theclimb_yeonnam",
    classId: "class_yeon2",
    authorId: "user_031",
    authorName: "익명",
    isAnonymous: true,
    title: "루트 재미있음",
    content: "동작 다양해서 재밌어요.",
    viewer: 97,
    professorId: "prof_kim",
    rating: 4.6,
    classDate: "2026-04-16",
    createdAt: new Date(),
  },
];

    for (const review of reviews) {
      await addDoc(collection(db, "reviews"), review);
    }

    console.log("리뷰 더미데이터 업로드 완료!");
  } catch (e) {
    console.error("업로드 실패:", e);
  }
};