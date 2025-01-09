import { useEffect, useMemo, useState } from "react";
import Layout from "../template/Layout";
import { fetchRepositories } from "../api/repositories";
import RepositoryCard from "../components/RepositoryCard";
import styles from "../styles/home.module.scss";
import { Empty, Select, Input } from "antd";
import AvatarName from "../components/AvatarName";

type ISortOptionRecord = {
  label: string;
  value: "name" | "updated_at" | "stargazers_count";
};

const SORT_OPTIONS: ISortOptionRecord[] = [
  {
    value: "updated_at",
    label: "Last Updated",
  },
  {
    value: "name",
    label: "Name",
  },
  {
    value: "stargazers_count",
    label: "Stars",
  },
];

function HomePage() {
  const [repositories, setRepositories] = useState<IRepositoryRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortByKey, setSortByKey] = useState<ISortOptionRecord["value"]>(
    SORT_OPTIONS[0].value
  );

  const filteredRepositories = useMemo(() => {
    let matchingRepositories = repositories;
    if (searchKeyword) {
      matchingRepositories = repositories.filter((repository) =>
        repository.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (sortByKey === "name") {
      return matchingRepositories.sort((a, b) =>
        a[sortByKey].toLowerCase() > b[sortByKey].toLowerCase()
          ? 1
          : a[sortByKey].toLowerCase() < b[sortByKey].toLowerCase()
          ? -1
          : 0
      );
    }
    return matchingRepositories.sort((a, b) =>
      a[sortByKey] < b[sortByKey] ? 1 : a[sortByKey] > b[sortByKey] ? -1 : 0
    );
  }, [repositories, searchKeyword, sortByKey]);

  useEffect(() => {
    setIsFetching(true);
    fetchRepositories()
      .then(setRepositories)
      .catch((error) =>
        console.error("Error while fetching repositories:", error)
      )
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <Layout loading={isFetching}>
      {repositories.length > 0 && (
        <AvatarName
          src={repositories[0].owner.avatar_url}
          name={repositories[0].owner.login}
        />
      )}
      <div className={styles.filters}>
        <Input.Search
          variant="outlined"
          placeholder="Filter by name"
          onSearch={setSearchKeyword}
        />
        <Select
          prefix="Sort: "
          value={sortByKey}
          onChange={setSortByKey}
          options={SORT_OPTIONS}
        />
      </div>
      <div className={styles["list-container"]} data-testid="repositories-list">
        {!isFetching &&
          filteredRepositories.length > 0 &&
          filteredRepositories.map((repository) => (
            <RepositoryCard repository={repository} key={repository.id} />
          ))}
      </div>
      {!isFetching && !filteredRepositories.length && <Empty />}
    </Layout>
  );
}

export default HomePage;
