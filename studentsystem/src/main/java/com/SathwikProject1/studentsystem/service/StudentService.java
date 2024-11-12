package com.SathwikProject1.studentsystem.service;

import java.util.List;

import com.SathwikProject1.studentsystem.model.Student;

public interface StudentService {
	public Student saveStudent(Student student);

	public List<Student> getAllStudents();

	public Student updateStudent(int id, Student studentDetails);

	public void deleteStudent(int id);
}
