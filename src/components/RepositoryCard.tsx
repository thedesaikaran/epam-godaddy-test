import { Tag } from "antd";
import styles from "../styles/repository-card.module.scss";
import dayjs from "dayjs";
import { ForkOutlined, StarOutlined, WarningOutlined } from "@ant-design/icons";
import { Link } from "react-router";

interface IRepositoryCardProps {
  repository: IRepositoryRecord;
}

function RepositoryCard({ repository }: IRepositoryCardProps) {
  return (
    <div className={styles.wrapper}>
      <div>
        <Link to={`/${repository.name}`} className={styles.heading}>{repository.name}</Link>
        <p>{repository.description}</p>
      </div>
      <div className={styles.tags}>
        <div>
          {repository.language && (
            <Tag color="blue" title="Language">
              {repository.language}
            </Tag>
          )}
          {repository.license?.name && (
            <Tag color="green" title="License">
              {repository.license?.name}
            </Tag>
          )}
          {typeof repository.forks_count === "number" && (
            <Tag title="Forks" icon={<ForkOutlined />}>
              {repository.forks_count}
            </Tag>
          )}
          {typeof repository.stargazers_count === "number" && (
            <Tag title="Stargazers" icon={<StarOutlined />}>
              {repository.stargazers_count}
            </Tag>
          )}
          {typeof repository.open_issues_count === "number" && (
            <Tag title="Open issues" icon={<WarningOutlined />}>
              {repository.open_issues_count}
            </Tag>
          )}
        </div>
        <div>
          <Tag>
            <small>
              Updated on {dayjs(repository.updated_at).format("MMM DD, YYYY")}
            </small>
          </Tag>
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;
