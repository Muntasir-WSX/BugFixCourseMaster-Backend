const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollCourse = async (studentId, courseId, batchId = null) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    throw new Error("Already enrolled in this course");
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    batchId,
    progress: { completedLessons: [], percent: 0 },
  });

  return enrollment;
};

const getMyEnrollments = async (studentId) => {
  return Enrollment.find({ student: studentId })
    .populate("course", "title instructorName price category tags")
    .sort({ createdAt: -1 });
};

// Fixed req/res runtime crash
const completeLesson = async (enrollId, studentId, lessonId) => {
  const enrollment = await Enrollment.findOne({
    _id: enrollId,
    student: studentId,
  });

  if (!enrollment) {
    throw new Error("Unauthorized or Enrollment not found");
  }

  const alreadyDone = enrollment.progress.completedLessons
    .map(String)
    .includes(String(lessonId));

  if (!alreadyDone) {
    enrollment.progress.completedLessons.push(lessonId);
  }

  const course = await Course.findById(enrollment.course);
  if (!course) throw new Error("Course not found");

  const totalLessons = course.syllabus ? course.syllabus.reduce(
    (sum, mod) => sum + (mod.lessons ? mod.lessons.length : 0),
    0
  ) : 0;

  const completed = enrollment.progress.completedLessons.length;
  enrollment.progress.percent =
    totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

  await enrollment.save();
  return enrollment;
};

module.exports = { enrollCourse, getMyEnrollments, completeLesson };