import css from "./styles.css";
import clouds from "./clouds.svg";

export const styles = css.replace("CLOUD_TEXTURE", encodeURIComponent(clouds));
