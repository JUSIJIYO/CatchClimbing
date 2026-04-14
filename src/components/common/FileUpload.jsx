import icon from "../../assets/icon/FileUpload.svg";
import '../../styles/css/common/FileUpload.css';
function FileUpload() {

  const updateFile = (e) => {
    const file = e.target.files[0];
   
  };

  return (
    <div>
      <input type="file" 
      id="fileUpload"
      onChange={updateFile} 
      />
      <label htmlFor="fileUpload"><img src={icon} alt="fileUpdate"/></label>
    </div>
  );
}

export default FileUpload;
