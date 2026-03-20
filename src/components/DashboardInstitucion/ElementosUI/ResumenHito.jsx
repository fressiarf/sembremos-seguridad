import './ElementosUI.css';

export const ResumenHito = ({ meta, zona }) => {
  return (
    <div className="ResumenHito">
      <h4>Meta Programada</h4>
      <p>{meta}</p>
      <span>Jurisdicción: {zona}</span>
    </div>
  );
};

export default ResumenHito;
