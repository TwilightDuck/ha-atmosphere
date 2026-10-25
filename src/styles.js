import css from "./styles.css";
import sky from "./sky.css";
import motion from "./motion.css";
import clouds from "./clouds.svg";

export const styles = (css + sky + motion).replace(
  "CLOUD_TEXTURE",
  encodeURIComponent(clouds),
);
