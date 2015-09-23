Gradebook = function() {
  /* 6.170's prefered constructor idiom (does not require use of the "new"
  keyword). */
  var that = Object.create(Gradebook.prototype);

  // Keys are student names, values are always true. 
  var students = {};
  // Keys are assignments, values are maps from student names to grades
  var assignments = {};

  that.addStudent = function(student) {
    students[student] = true;
  };

  that.addAssignment = function(assignment) {
    assignments[assignment] = {};
  };

  that.setGrade = function(student, assignment, grade) {
    assignments[assignment][student] = grade;
  };

  that.getGrade = function(student, assignment) {
    return assignments[assignment][student] || 0;
  };

  that.getStudents = function() {
    return Object.keys(students);
  }

  that.getAssignments = function() {
    return Object.keys(assignments);
  }

  return that;
}

