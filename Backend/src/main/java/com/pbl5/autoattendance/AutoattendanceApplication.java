package com.pbl5.autoattendance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pbl5.autoattendance.embedded.AttendanceCheckId;
import com.pbl5.autoattendance.embedded.AuthorityId;
import com.pbl5.autoattendance.embedded.StudentClassId;
import com.pbl5.autoattendance.model.*;
import com.pbl5.autoattendance.model.Class;
import com.pbl5.autoattendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class AutoattendanceApplication {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	private StudentVectorRepository studentVectorRepository;
	@Autowired
	private AuthorityRepository authorityRepository;
	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private LessonRepository lessonRepository;
	@Autowired
	private StudentClassRepository studentClassRepository;
	@Autowired
	private AttendanceCheckRepository attendanceCheckRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(AutoattendanceApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner commandLineRunner(){
//		return args -> {
//			Map<String, Object> identityData = loadIdentityData();
//			List<String> usernameList = new ArrayList<>(List.of("trung", "tai", "minh_hoang", "trung_phong"));
//			List<Student> students = new ArrayList<>();
//
//			for (int i = 0; i < usernameList.size(); i++) {
//				String username = usernameList.get(i);
//				User user = createAndSaveUser(username);
//				createAndSaveAuthority(user);
//				Student student = createAndSaveStudent(user, username, i);
//				createAndSaveStudentVector(student, identityData, username);
//				students.add(student);
//			}
//
//			// Thêm dữ liệu giáo viên
//			List<String> teacherUsernameList = new ArrayList<>(List.of("teacher1", "teacher2", "teacher3"));
//			List<Teacher> teachers = new ArrayList<>();
//
//			for (int i = 0; i < teacherUsernameList.size(); i++) {
//				String username = teacherUsernameList.get(i);
//				User user = createAndSaveUser(username);
//				createAndSaveAuthority(user);
//				Teacher teacher = createAndSaveTeacher(user, "Giáo viên " + (i+1), i);
//				teachers.add(teacher);
//			}
//
//			// Thêm dữ liệu lớp học
//			List<Class> classes = new ArrayList<>();
//			String[] classNames = {"Lập trình Java", "Cơ sở dữ liệu", "Trí tuệ nhân tạo", "Phát triển ứng dụng web"};
//			int[] weeksPerClass = {15, 12, 10, 16}; // Số tuần học cho mỗi lớp
//
//			for (int i = 0; i < classNames.length; i++) {
//				Class aClass = new Class();
//				aClass.setName(classNames[i]);
//				aClass.setTeacher(teachers.get(i % teachers.size()));
//				// Tạo ngày cách hiện tại 3 ngày
//				Calendar cal = Calendar.getInstance();
//				cal.add(Calendar.DAY_OF_MONTH, -3);
//				aClass.setCreatedAt(cal.getTime()); // Thêm thời điểm cách đây 3 ngày
//				aClass.setNumberOfWeeks(weeksPerClass[i]); // Thiết lập số tuần học
//				classes.add(classRepository.save(aClass));
//			}
//
//			// Thêm các sinh viên vào lớp có id = 1
//			Class firstClass = classRepository.findById(1).orElse(null);
//			if (firstClass != null) {
//				for (Student student : students) {
//					// Thêm sinh viên vào lớp
//					StudentClass studentClass = new StudentClass();
//					StudentClassId studentClassId = new StudentClassId();
//					studentClassId.setStudentId(student.getId());
//					studentClassId.setClassId(firstClass.getId());
//					studentClass.setId(studentClassId);
//					studentClass.setStudent(student);
//					studentClass.setAClass(firstClass);
//					studentClassRepository.save(studentClass);
//				}
//			}
//
//			// Thêm dữ liệu lịch học cho các tuần
//			for (Class aClass : classes) {
//				// Mỗi lớp có 2 buổi học trong tuần: thứ 2 (7h-10h) và thứ 5 (12h-16h)
//				java.util.Date createdDate = aClass.getCreatedAt();
//				Calendar calendar = Calendar.getInstance();
//				calendar.setTime(createdDate);
//
//				// Lấy ngày hiện tại làm ngày bắt đầu
//				java.util.Date startDate = calendar.getTime();
//
//				// Tạo lịch học cho mỗi tuần
//				for (int week = 0; week < aClass.getNumberOfWeeks(); week++) {
//					// Buổi học thứ 2 (7h-10h)
//					calendar.setTime(startDate);
//					calendar.add(Calendar.WEEK_OF_YEAR, week);
//
//					// Điều chỉnh ngày để là thứ 2
//					int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
//					int daysUntilMonday = (dayOfWeek <= Calendar.MONDAY) ?
//						(Calendar.MONDAY - dayOfWeek) :
//						(Calendar.MONDAY + 7 - dayOfWeek);
//
//					calendar.add(Calendar.DAY_OF_MONTH, daysUntilMonday);
//					java.util.Date mondayDate = calendar.getTime();
//
//					Lesson mondayLesson = new Lesson();
//					mondayLesson.setAClass(aClass);
//					mondayLesson.setLessonDate(mondayDate);
//					mondayLesson.setStartTime(LocalTime.of(7, 0)); // 7h sáng
//					mondayLesson.setEndTime(LocalTime.of(10, 0)); // 10h sáng
//					mondayLesson.setRoom("A10" + (aClass.getId() % 5 + 1));
//
//					// Đánh dấu các buổi học đã qua là đã hoàn thành
//					java.util.Date now = new java.util.Date();
//
//					// Kiểm tra nếu buổi học đã qua (so sánh ngày và giờ)
//					Calendar lessonCalendar = Calendar.getInstance();
//					lessonCalendar.setTime(mondayDate);
//					lessonCalendar.set(Calendar.HOUR_OF_DAY, mondayLesson.getEndTime().getHour());
//					lessonCalendar.set(Calendar.MINUTE, mondayLesson.getEndTime().getMinute());
//
//					mondayLesson.setIsCompleted(lessonCalendar.getTime().before(now));
//
//					lessonRepository.save(mondayLesson);
//
//					// Buổi học thứ 5 (12h-16h)
//					calendar.setTime(mondayDate);
//					calendar.add(Calendar.DAY_OF_MONTH, 3); // Thêm 3 ngày để đến thứ 5
//					java.util.Date thursdayDate = calendar.getTime();
//
//					Lesson thursdayLesson = new Lesson();
//					thursdayLesson.setAClass(aClass);
//					thursdayLesson.setLessonDate(thursdayDate);
//					thursdayLesson.setStartTime(LocalTime.of(9, 0)); // 12h trưa
//					thursdayLesson.setEndTime(LocalTime.of(16, 0)); // 16h chiều
//					thursdayLesson.setRoom("A20" + (aClass.getId() % 5 + 1));
//
//					// Đánh dấu các buổi học đã qua là đã hoàn thành
//					lessonCalendar = Calendar.getInstance();
//					lessonCalendar.setTime(thursdayDate);
//					lessonCalendar.set(Calendar.HOUR_OF_DAY, thursdayLesson.getEndTime().getHour());
//					lessonCalendar.set(Calendar.MINUTE, thursdayLesson.getEndTime().getMinute());
//
//					thursdayLesson.setIsCompleted(lessonCalendar.getTime().before(now));
//
//					lessonRepository.save(thursdayLesson);
//				}
//			}
//
//			// Tự động tạo dữ liệu AttendanceCheck cho mỗi sinh viên và buổi học sau khi đã có đầy đủ dữ liệu
//			if (firstClass != null) {
//				List<Lesson> lessons = lessonRepository.findByaClass_Id(firstClass.getId());
//				for (Student student : students) {
//					for (Lesson lesson : lessons) {
//						AttendanceCheck attendanceCheck = new AttendanceCheck();
//						AttendanceCheckId attendanceCheckId = new AttendanceCheckId();
//						attendanceCheckId.setStudentId(student.getId());
//						attendanceCheckId.setLessonId(lesson.getId());	
//						attendanceCheck.setId(attendanceCheckId);
//						attendanceCheck.setCheckinDate(null); // Mặc định là null
//						attendanceCheck.setImgPath(""); // Đường dẫn ảnh mặc định
//						attendanceCheck.setLesson(lesson);
//						attendanceCheck.setStudent(student);
//						attendanceCheckRepository.save(attendanceCheck);
//					}
//				}
//			}
//
//
//
//		};
//	}
//
//	private Map<String, Object> loadIdentityData() throws Exception {
//		ObjectMapper objectMapper = new ObjectMapper();
//		Path jsonPath = Paths.get("identity_embeddings.json");
//		File jsonFile = jsonPath.toFile();
//		return objectMapper.readValue(jsonFile, Map.class);
//	}
//
//	private User createAndSaveUser(String username) {
//		User user = User.builder()
//				.username(username)
//				.password(passwordEncoder.encode("12345"))
//				.enabled(true)
//				.build();
//		return userRepository.save(user);
//	}
//
//	private void createAndSaveAuthority(User user) {
//		Authority authority = new Authority();
//		AuthorityId authorityId = new AuthorityId();
//		authorityId.setUsername(user.getUsername());
//		authorityId.setAuthority("ROLE_USER");
//		authority.setId(authorityId);
//		authority.setUser(user);
//		authorityRepository.save(authority);
//	}
//
//	private Student createAndSaveStudent(User user, String name, int index) {
//		Student student = Student.builder()
//				.name(name)
//				.phone("1234567890")
//				.email("abc" + index + "@sv1.udn.vn")
//				.user(user)
//				.build();
//		return studentRepository.save(student);
//	}
//
//	private Teacher createAndSaveTeacher(User user, String name, int index) {
//		Teacher teacher = new Teacher();
//		teacher.setName(name);
//		teacher.setPhone("098765432" + index);
//		teacher.setEmail("teacher" + index + "@udn.vn");
//		teacher.setUser(user);
//		return teacherRepository.save(teacher);
//	}
//
//	private void createAndSaveStudentVector(Student student, Map<String, Object> identityData, String username) throws Exception {
//		ObjectMapper objectMapper = new ObjectMapper();
//		String featureVectorJson = objectMapper.writeValueAsString(identityData.get(username));
//
//		StudentVector studentVector = StudentVector.builder()
//				.featureVector(featureVectorJson)
//				.student(student)
//				.build();
//
//		studentVectorRepository.save(studentVector);
//	}
}
