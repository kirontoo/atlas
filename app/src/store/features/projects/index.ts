/* eslint-disable no-unused-vars */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Project } from '../../../types';
import { RootState } from '../../reducer';
import { Projects } from './MockProjectData';

export interface ProjectState {
  loading: boolean;
  projects: Project[];
  type?: string;
}

const initialState: ProjectState = {
  loading: false,
  projects: Projects,
};

enum ProjectsActions {
  LOADING = 'projects/loading',
  NOT_LOADING = 'projects/not_loading',
  UPDATED = 'projects/updated',
  ADDED = 'projects/added',
  DELETED = 'projects/deleted',
}

const projectSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    loading(state: ProjectState) {
      return {
        ...state,
        type: ProjectsActions.LOADING,
        loading: true,
      };
    },

    notLoading(state: ProjectState) {
      return {
        ...state,
        type: ProjectsActions.NOT_LOADING,
        loading: false,
      };
    },

    update(state: ProjectState, action: PayloadAction<Project[]>) {
      return {
        ...state,
        type: ProjectsActions.UPDATED,
        projects: [...state.projects, ...action.payload],
      };
    },

    add(state: ProjectState, action: PayloadAction<Project[]>) {
      return {
        ...state,
        type: ProjectsActions.DELETED,
        projects: [...state.projects, ...action.payload],
      };
    },

    delete(state: ProjectState, action: PayloadAction<Project[]>) {
      return {
        ...state,
        type: ProjectsActions.DELETED,
        projects: [...state.projects, ...action.payload],
      };
    },
  },
});

export const selectProjects = (state: RootState) => state.projects.projects ?? [];
const selectProjectsId = (_: RootState, projectId: string) => projectId;

export const selectProjectById = createSelector(
  [selectProjects, selectProjectsId],
  (projects, projectId) => projects.find((p: Project) => p.id == projectId),
);

export default projectSlice.reducer;
