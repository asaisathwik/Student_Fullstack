package com.SathwikProject1.studentsystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SathwikProject1.studentsystem.model.Student;
import com.SathwikProject1.studentsystem.repository.StudentRepository;
@Service
public class StudentServiceImpl implements StudentService{
	
	@Autowired
	private StudentRepository studentRepository;
	@Override
	public Student saveStudent(Student student) {
		// TODO Auto-generated method stub
		return studentRepository.save(student);
	}
	@Override
	public List<Student> getAllStudents() {
		// TODO Auto-generated method stub
		return studentRepository.findAll();
	}
	
	 public Student updateStudent(int id, Student studentDetails) {
	        Student student = studentRepository.findById(id).orElseThrow();
	        student.setName(studentDetails.getName());
	        student.setAddress(studentDetails.getAddress());
	        return studentRepository.save(student);
	    }

	    public void deleteStudent(int id) {
	        studentRepository.deleteById(id);
	    }
	
	
	
}
