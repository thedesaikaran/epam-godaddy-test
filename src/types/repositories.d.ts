interface IRepositoryRecord {
  clone_url: string;
  forks_count: number;
  forks: number;
  full_name: string;
  html_url: string;
  id: number;
  language: string;
  name: string;
  open_issues_count: number;
  owner: IOwnerRecord;
  ssh_url: string;
  stargazers_count: number;
  updated_at: string;
  watchers: number;
  description?: string;
  license?: ILicenseRecord;
}

interface ILicenseRecord {
  name: string;
}

interface IOwnerRecord {
  login: string;
  avatar_url: string;
}
