import {
  createSlice,
  AnyAction,
  Action,
  createAsyncThunk
} from "@reduxjs/toolkit";
import { fetcher, RequestError } from "../utils/client";
import type { User, AuthResponse } from "../types";
import { verifyPayment } from "./mutations/payment";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{rejectValue: string}>();

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

export const loginUser = createAppAsyncThunk(
  "auth/signin",
  async (input: Omit<Input, "name">, {rejectWithValue}) => {
    try {
      const data = await fetcher<AuthResponse>("/api/auth/local/signin", {
        body: input,
      });
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue((error as RequestError).message);
    }
    
  }
);

export const registerUser = createAppAsyncThunk(
  "auth/register",
  async (input: Input, {rejectWithValue}) => {
    try {
      const data = await fetcher<AuthResponse>("/api/auth/local/register", {
        body: input,
      });
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue((error as RequestError).message);
    }
  }
);

export const loginOnMount = createAppAsyncThunk("auth/sigin", async (undefined, {rejectWithValue}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return rejectWithValue("Token not found");
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
    return rejectWithValue((error as RequestError).message)
  }
});

export const googleLogIn = createAppAsyncThunk('auth/google', async (input: {access_token: string, id_token: string}, {rejectWithValue}) => {
  try {
    const response = await fetcher<AuthResponse>('/api/auth/google', {
      body: input
    });
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    return rejectWithValue((error as RequestError).message);
  }
})


const isPendingAction = (action: AnyAction) => {
  const actions = (action.type as string).split('/');
  return actions[0] === 'auth' && actions[2] === 'pending';
};

interface RejectedAction extends Action {
  payload: RequestError
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
      .addMatcher(isRejectedAction, (state, { payload }) => {
        const error = payload?.message || 'An error occured, try again'
        return {
          error,
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
