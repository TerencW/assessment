import { apiUrl } from "../config";
import http from "./httpService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const apiEndpoint = apiUrl ;

export async function getCafeList(locationQuery = '') {

    const response = await http.get(`${apiEndpoint}/cafes?location=${locationQuery}`);
    return response;

  };
export async function deleteCafe(id) {  

  const result = await http.delete(`${apiEndpoint}/cafe/${id}`, null);
  return result;
}

export async function saveCafe(saveedit , cafe) {
  //EDIT
  if (saveedit) {
    return await http.put(`${apiEndpoint}/cafe/${saveedit.cafe_id}`, cafe);
  }
  //ADD
  return await http.post(`${apiEndpoint}/cafe`, cafe);
   
}



// ✅ Fetch Cafes
export const fetchCafes = createAsyncThunk("cafes/fetchCafes", async (location = "") => {
  const response = await getCafeList(location);
  return response.data; // Assuming response follows { data: [...] }
});

// ✅ Delete a Cafe
export const removeCafe = createAsyncThunk("cafes/removeCafe", async (cafeId, { rejectWithValue }) => {
  try {
    await deleteCafe(cafeId);
    return cafeId; // Return ID to remove from state
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ Add/Edit a Cafe
export const saveCafeAsync = createAsyncThunk("cafes/saveCafe", async ({ saveedit, cafe }, { rejectWithValue }) => {
  try {
    const response = await saveCafe(saveedit, cafe);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ✅ Initial State
const initialState = {
  cafes: [],
  loading: false,
  error: null,
};

// ✅ Create Slice
const cafeSlice = createSlice({
  name: "cafes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Cafes
      .addCase(fetchCafes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCafes.fulfilled, (state, action) => {
        state.loading = false;
        state.cafes = action.payload;
      })
      .addCase(fetchCafes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete Cafe
      .addCase(removeCafe.fulfilled, (state, action) => {
        state.cafes = state.cafes.filter((cafe) => cafe.cafe_id !== action.payload);
      })
      .addCase(removeCafe.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Add/Edit Cafe
      .addCase(saveCafeAsync.fulfilled, (state, action) => {
        const updatedCafe = action.payload;
        const index = state.cafes.findIndex((cafe) => cafe.cafe_id === updatedCafe.cafe_id);
        if (index !== -1) {
          state.cafes[index] = updatedCafe; // Update existing cafe
        } else {
          state.cafes.push(updatedCafe); // Add new cafe
        }
      })
      .addCase(saveCafeAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cafeSlice.reducer;
