import {
  createSlice,
  createAsyncThunk,
  AnyAction,
  Action,
} from "@reduxjs/toolkit";
import { fetcher, RequestError } from "../utils/client";
import type { User, AuthResponse } from "../types";
import { verifyPayment } from "./mutations/payment";

type AuthState =
  | {
      token: null;
      user: null;
      error: null;
    }
  | {
      token: string;
      user: User;
      error: null;
    }
  | {
      token: null;
      user: null;
      error: string;
    };

interface Input {
  name: string;
  password: string;
  email: string;
}

const initialState = {
  token: null,
  user: null,
  error: null,
} as AuthState;

export const loginUser = createAsyncThunk(
  "auth/signin",
  async (input: Omit<Input, "name">) => {
    const data = await fetcher<AuthResponse>("/api/auth/local/signin", {
      body: input,
    });
    localStorage.setItem("token", data.token);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (input: Input) => {
    const data = await fetcher<AuthResponse>("/api/auth/local/register", {
      body: input,
    });
    localStorage.setItem("token", data.token);
    return data;
  }
);

export const loginOnMount = createAsyncThunk("auth/sigin", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new RequestError("Token not found");
  }

  try {
    const data = await fetcher<User>("/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      user: data,
      token,
    };
  } catch (error) {
    localStorage.removeItem("token");
    throw error;
  }
});

export const googleLogIn = createAsyncThunk('auth/google', async (input: {access_token: string, id_token: string}) => {
  const response = await fetcher<AuthResponse>('/api/auth/google', {
    body: input
  });
  localStorage.setItem('token', response.token);
  return response;
})

const isPendingAction = (action: AnyAction) => {
  const actions = (action.type as string).split('/');
  return actions[0] === 'auth' && actions[2] === 'pending';
};

interface RejectedAction extends Action {
  error: string;
}

const isRejectedAction = (action: AnyAction): action is RejectedAction => {
  const actions = (action.type as string).split('/');
  return actions[0] === 'auth' && actions[2] === "rejected";
};

interface FulfilledAction extends Action {
  payload: AuthResponse;
}

const isFullfilledAction = (action: AnyAction): action is FulfilledAction => {
  const actions = (action.type as string).split('/');
  return actions[0] === 'auth' && actions[2] === "fulfilled";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("token");
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(verifyPayment.matchFulfilled, (state, {payload}) => {
      state.user = payload;
    })
      .addMatcher(isPendingAction, () => {
        return initialState;
      })
      .addMatcher(isRejectedAction, (state, { error }) => {
        return {
          error: error,
          token: null,
          user: null,
        };
      })
      .addMatcher(isFullfilledAction, (state, { payload }) => {
        return {
          ...payload,
          error: null,
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
