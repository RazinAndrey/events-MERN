import s from './Footer.module.css';

function Footer(){
    return(
        <div className={s.footer}>
            <p className={s.footer_p}>
                &copy;{new Date().getFullYear()} Events
            </p>
            <p className={s.footer_p}>Razin A.N.</p>
        </div>
    );
}

export default Footer;