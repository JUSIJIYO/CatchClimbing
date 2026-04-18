import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export const seedCommunity = async () => {
  try {
    const posts = [
      {
        branchId: "theclimb_gangnam",
        authorId: "user_001",
        authorName: "김클라이머",
        isAnonymous: false,
        title: "강남점 오늘 세팅 구역 어디인가요?",
        content: "오후에 방문 예정인데 세팅 끝났는지 궁금합니다!",
        viewer: 45,
        commentCount: 2,
        createdAt: new Date(),
        isReported: false,
      },
      {
        branchId: "theclimb_hongdae",
        authorId: "user_002",
        authorName: "익명회원",
        isAnonymous: true,
        title: "홍대점 주차 팁 있나요?",
        content: "건물 주차장 매번 만차라... 근처 공영주차장 추천 부탁드려요.",
        viewer: 120,
        commentCount: 1,
        createdAt: new Date(),
        isReported: false,
      },
      {
        branchId: null, // 자유게시판 성격
        authorId: "user_003",
        authorName: "장비충",
        isAnonymous: false,
        title: "초보용 초크백 브랜드 추천해주세요",
        content: "가성비 좋은 블랙다이아몬드나 오가닉 중에 고민 중입니다.",
        viewer: 88,
        commentCount: 1,
        createdAt: new Date(),
        isReported: false,
      },
      {
        branchId: "theclimb_sillim",
        authorId: "user_004",
        authorName: "신림홀드",
        isAnonymous: false,
        title: "신림점 지구력 벽 난이도 어떤가요?",
        content: "요즘 지구력이 너무 부족해서 연습하러 가려는데 매운 편인가요?",
        viewer: 32,
        commentCount: 1,
        createdAt: new Date(),
        isReported: false,
      },
      {
        branchId: null,
        authorId: "user_005",
        authorName: "부상조심",
        isAnonymous: true,
        title: "손가락 활차 부상인 것 같은데 병원 추천좀요",
        content: "강남이나 서초 쪽 전문 병원 아시는 분 계신가요?",
        viewer: 210,
        commentCount: 0,
        createdAt: new Date(),
        isReported: false,
      },
    ];

    // 🔥 1. posts 업로드 + ID 저장
    const postIds = [];
    for (const post of posts) {
      const docRef = await addDoc(collection(db, "posts"), post);
      postIds.push(docRef.id);
    }

    const comments = [
      {
        postId: postIds[0], 
        authorId: "user_006",
        authorName: "루트세터팬",
        isAnonymous: false,
        isProfessor: false,
        content: "방금 다녀왔는데 컴피벽 쪽 세팅 끝났더라고요!",
        createdAt: new Date(),
      },
      {
        postId: postIds[0],
        authorId: "user_007",
        authorName: "알림봇",
        isAnonymous: true,
        isProfessor: false,
        content: "오후 2시 기준으로 전체 이용 가능합니다.",
        createdAt: new Date(),
      },
      {
        postId: postIds[1], 
        authorId: "user_008",
        authorName: "홍대주민",
        isAnonymous: false,
        isProfessor: false,
        content: "저는 그냥 지하철 타고 가요... 주차 진짜 헬입니다.",
        createdAt: new Date(),
      },
      {
        postId: postIds[2], 
        authorId: "user_009",
        authorName: "장비마스터",
        isAnonymous: false,
        isProfessor: true,
        content: "입문용으로는 오가닉이 디자인도 예쁘고 오래 쓰기 좋습니다.",
        createdAt: new Date(),
      },
      {
        postId: postIds[3], 
        authorId: "user_010",
        authorName: "지구력왕",
        isAnonymous: false,
        isProfessor: false,
        content: "빨강 난이도 기준 다른 지점보다 조금 더 길게 느껴졌어요.",
        createdAt: new Date(),
      },
    ];

    for (const comment of comments) {
      await addDoc(collection(db, "comments"), comment);
    }

    const reviews = [
      {
        branchId: "theclimb_gangnam",
        classId: "class_101",
        authorId: "user_011",
        authorName: "레벨업중",
        isAnonymous: true,
        title: "스타터 패키지 강추!",
        content: "기본기부터 차근차근 알려주셔서 너무 유익했어요.",
        viewer: 50,
        professorId: "prof_kim",
        rating: 5.0,
        classDate: "2026-03-15",
        createdAt: new Date(),
      },
      {
        branchId: "theclimb_hongdae",
        classId: "class_102",
        authorId: "user_012",
        authorName: "이다솔",
        isAnonymous: false,
        title: "볼더링 레벨 1 수업 후기",
        content: "무게 중심 이동하는 법을 확실히 배웠습니다.",
        viewer: 42,
        professorId: "prof_lee",
        rating: 4.8,
        classDate: "2026-04-10",
        createdAt: new Date(),
      },
      {
        branchId: "theclimb_sillim",
        classId: "class_103",
        authorId: "user_013",
        authorName: "익명",
        isAnonymous: true,
        title: "조금 아쉬운 중급반",
        content: "사람이 너무 많아서 피드백 받을 시간이 부족했어요.",
        viewer: 35,
        professorId: "prof_park",
        rating: 3.5,
        classDate: "2026-04-12",
        createdAt: new Date(),
      },
      {
        branchId: "theclimb_gangnam",
        classId: "class_104",
        authorId: "user_014",
        authorName: "다이노장인",
        isAnonymous: false,
        title: "다이노 특강 대만족",
        content: "쫄보였는데 선생님 덕분에 뛰는 법을 알게 됐습니다.",
        viewer: 66,
        professorId: "prof_choi",
        rating: 5.0,
        classDate: "2026-04-14",
        createdAt: new Date(),
      },
      {
        branchId: "theclimb_hongdae",
        classId: "class_105",
        authorId: "user_015",
        authorName: "운동조아",
        isAnonymous: false,
        title: "친절한 설명 감사합니다",
        content: "영상 찍어서 자세 교정해주시는 게 큰 도움이 됐어요.",
        viewer: 28,
        professorId: "prof_kim",
        rating: 4.9,
        classDate: "2026-04-15",
        createdAt: new Date(),
      },
    ];

    for (const review of reviews) {
      await addDoc(collection(db, "reviews"), review);
    }

    console.log("5개씩 총 15개의 더미 데이터 업로드 완료!");
  } catch (e) {
    console.error("업로드 실패:", e);
  }
};