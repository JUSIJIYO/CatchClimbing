import PrfClassItem from './PrfClassItem';

function PrfClassCard({ classes, onEditClick, isProfessor }) {
  if (classes.length === 0) {
    return <p>등록된 강의가 없습니다.</p>;
  }

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {classes.map((cls) => (
        <PrfClassItem
          key={cls.id}
          data={cls}
          isProfessor={isProfessor}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
}

export default PrfClassCard;
