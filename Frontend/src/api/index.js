import api from './axios';

export { api };

// Token management helper functions
const getToken = () => localStorage.getItem('token');

// Set up token for axios requests
const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Check if token exists and set header
if (getToken()) {
  setAuthHeader(getToken());
}

// Export API service functions
export const AuthService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setAuthHeader(response.data.token);
    }
    return response;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setAuthHeader(response.data.token);
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthHeader(null);
  },
  getCurrentUser: () => api.get('/auth/me'),
  isAuthenticated: () => {
    return !!getToken();
  }
};

export const ClassService = {
  getClasses: () => api.get('/classes'),
  getClassById: (id) => api.get(`/classes/${id}`),
  getClassByLessonId: (lessonId) => api.get(`/classes/lesson/${lessonId}`),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  getStudentsByClassId: (classId) => api.get(`/classes/${classId}/students`),
};

export const LessonService = {
  getLessons: () => api.get('/lessons'),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  createLesson: (lessonData) => api.post('/lessons', lessonData),
  updateLesson: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
};

export const StudentService = {
  getStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export const AttendanceService = {
  getAttendanceStatus: (lessonId, studentId) => 
    api.post('/attendance/get_status', { lessonId, studentId }),
  checkIn: (lessonId, studentId, imgData) => 
    api.post('/attendance/check_in', { lessonId, studentId, imgData }),
  confirmAttendance: (lessonId, studentId) => 
    api.post('/attendance/confirm', { lessonId, studentId }),
};

export default api; 