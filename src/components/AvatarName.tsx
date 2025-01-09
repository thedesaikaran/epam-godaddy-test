import { Avatar } from "antd";
import styles from "../styles/avatar-name.module.scss";

interface IAvatarNameProps {
  src: string;
  name: string;
}

function AvatarName({ src, name }: IAvatarNameProps) {
  return (
    <span className={styles.wrapper}>
      <Avatar src={src} />
      {name}
    </span>
  );
}

export default AvatarName;
