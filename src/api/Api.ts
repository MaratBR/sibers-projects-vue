import axios, { type AxiosInstance } from "axios";

export interface ApiOptions {
  accessTokenGetter?: () => string | null;
  baseUrl?: string;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Pagination<T> {
  items: T[];
  page: number;
  pageSize: number;
}

export interface UserDto {
  userName: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  createdAt: string;
  roles: string[];
  email: string;
  id: string;
}

export interface ProjectDto {
  id: number;
  name: string;
  contractorCompany: string;
  clientCompany: string;
  startsAt: string;
  endsAt: string;
}

export interface NewProjectData {
  name: string;
  contractorCompany: string;
  clientCompany: string;
  priority: number;
  projectManagerId: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

export default class Api {
  private readonly _client: AxiosInstance;

  constructor(options: ApiOptions) {
    this._client = axios.create({ timeout: 20000, baseURL: options.baseUrl });

    if (options.accessTokenGetter) {
      this._client.interceptors.request.use((request) => {
        const token = options.accessTokenGetter
          ? options.accessTokenGetter()
          : null;
        if (token) {
          request.headers = {
            ...(request.headers ?? {}),
            Authorization: `Bearer ${token}`,
          };
        }
        return request;
      });
    }
  }

  login(data: LoginData) {
    return this._client
      .post<LoginResponse>("api/auth/login", data)
      .then((r) => r.data);
  }

  whoami() {
    return this._client.get("api/auth/whoami").then((r) => r.data);
  }

  createProject(data: NewProjectData): Promise<ProjectDto> {
    return this._client.post("api/Projects", data).then((r) => r.data);
  }

  getUsers(params: { page: number }): Promise<Pagination<UserDto>> {
    return this._client.get("api/Employees", { params }).then((r) => r.data);
  }

  assignUser(userId: string, projectId: number) {
    return this._client.post("api/Projects/" + projectId + "/assignments", {
      userId,
    });
  }
}
