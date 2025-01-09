import { Link, useNavigate, useParams } from "react-router";
import AvatarName from "../components/AvatarName";
import Layout from "../template/Layout";
import { useEffect, useState } from "react";
import { fetchRepositoryDetails } from "../api/repositories";
import styles from "../styles/repository-details.module.scss";
import { Button, Dropdown, Input, MenuProps, notification, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
  ExportOutlined,
} from "@ant-design/icons";

function printText(text?: string) {
  return text || "--";
}

function getCloneMenuItems(repository: IRepositoryRecord): MenuProps["items"] {
  function copyValue(text: string) {
    return () => {
      window.navigator.clipboard
        .writeText(text)
        .then(() => notification.success({ message: "Copied to clipboard" }));
    };
  }

  return [
    {
      label: (
        <>
          <label>Clone with HTTPS</label>
          <Input
            value={repository.clone_url}
            readOnly
            addonAfter={
              <Button
                size="small"
                block
                type="text"
                onClick={copyValue(repository.clone_url)}
                data-testid="copy-https-clone-url"
              >
                <CopyOutlined />
              </Button>
            }
          />
        </>
      ),
      type: "item",
      key: "https",
    },
    {
      type: "divider",
    },
    {
      label: (
        <>
          <label>Clone with SSH</label>
          <Input
            value={repository.ssh_url}
            readOnly
            addonAfter={
              <Button
                size="small"
                block
                type="text"
                onClick={copyValue(repository.ssh_url)}
                data-testid="copy-ssh-clone-url"
              >
                <CopyOutlined />
              </Button>
            }
          />
        </>
      ),
      type: "item",
      key: "ssh",
    },
  ];
}

function RepositoryDetailsPage() {
  const [repositoryDetails, setRepositoryDetails] =
    useState<IRepositoryRecord | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isCloneMenuOpen, setIsCloneMenuOpen] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { repositoryName } = params;
    if (repositoryName) {
      setIsFetching(true);
      fetchRepositoryDetails(repositoryName)
        .then(setRepositoryDetails)
        .catch((error) => {
          console.error(
            `Error while fetching repository details of ${repositoryName}:`,
            error
          );
          notification.error({ message: `${repositoryName} not found.` });
          navigate("/");
        })
        .finally(() => setIsFetching(false));
    }
  }, [params]);

  return (
    <Layout loading={isFetching}>
      {repositoryDetails && (
        <div className={styles.header}>
          <Link to="/">
            <ArrowLeftOutlined />
          </Link>
          <AvatarName
            src={repositoryDetails.owner.avatar_url}
            name={repositoryDetails.full_name}
          />
        </div>
      )}
      {repositoryDetails && (
        <div className={styles["details-section"]}>
          <div className={styles.description}>
            <label>Description</label>
            <span data-testid="span-repository-description">
              {printText(repositoryDetails.description)}
            </span>
          </div>
          <div className={styles.details}>
            <label>Link</label>
            <span>
              <Button
                type="primary"
                href={repositoryDetails.html_url}
                target="_blank"
              >
                Open in GitHub <ExportOutlined />
              </Button>
            </span>
          </div>
          <div className={styles.details}>
            <label>Clone</label>
            <span>
              <Dropdown
                destroyPopupOnHide
                trigger={["click"]}
                onOpenChange={(open, trigger) => {
                  setIsCloneMenuOpen(open || trigger.source === "menu");
                }}
                open={isCloneMenuOpen}
                menu={{
                  items: getCloneMenuItems(repositoryDetails),
                }}
              >
                <Button type="primary" data-testid="clone-dropdown">
                  Clone <DownOutlined />
                </Button>
              </Dropdown>
            </span>
          </div>
          <div className={styles.details}>
            <label>License</label>
            <span>
              <Tag color="green">
                {printText(repositoryDetails.license?.name)}
              </Tag>
            </span>
          </div>
          <div className={styles.details}>
            <label>Language</label>
            <span>
              <Tag color="blue">{printText(repositoryDetails.language)}</Tag>
            </span>
          </div>
          <div className={styles.details}>
            <label>Stars</label>
            <span>{repositoryDetails.stargazers_count} Stars</span>
          </div>
          <div className={styles.details}>
            <label>Total Forks</label>
            <span>{repositoryDetails.forks} Forks</span>
          </div>
          <div className={styles.details}>
            <label>Total Open Issues</label>
            <span>{repositoryDetails.open_issues_count} Issues</span>
          </div>
          <div className={styles.details}>
            <label>Total Watchers</label>
            <span>{repositoryDetails.watchers} Watchers</span>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default RepositoryDetailsPage;
