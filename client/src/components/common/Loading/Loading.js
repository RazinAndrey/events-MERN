import loading from './../../../images/loading.gif';
import "./Loading.css";

function Loading(){
    return (
        <div className="loading">
            <img className="loading_img" src={loading} alt=""/>
        </div>
    )
}

export default Loading;