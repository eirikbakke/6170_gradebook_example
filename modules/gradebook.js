Gradebook = function() {
  /* 6.170's prefered constructor idiom (does not require use of the "new"
  keyword). */
  var that = Object.create(Gradebook.prototype);

  // Keys are student names, values are always true. 
  var students = {};
  // Keys are assignments, values are maps from student names to grades
  var assignments = {};

  var checkStringArgument = function(obj) {
    if ($.type(obj) !== "string" || obj.length === 0)
      throw new Error("Expected a non-empty string argument");
  };

  var checkKey = function(map, key) {
    checkStringArgument(key);
    if (!map.hasOwnProperty(key))
      throw new Error("No entry " + key);
  };

  that.addStudent = function(student) {
    checkStringArgument(student);
    students[student] = true;
  };

  that.addAssignment = function(assignment) {
    checkStringArgument(assignment);
    assignments[assignment] = {};
  };

  that.setGrade = function(student, assignment, grade) {
    checkKey(students, student);
    checkKey(assignments, assignment);
    if ($.type(grade) !== "number" || !isFinite(grade))
      throw new Error("Expected a numeric grade");
    assignments[assignment][student] = grade;
  };

  that.getGrade = function(student, assignment) {
    checkKey(students, student);
    checkKey(assignments, assignment);
    var ret = assignments[assignment][student];
    return ret === undefined ? 0 : ret;
  };

  that.getStudents = function() {
    return Object.keys(students);
  }

  that.getAssignments = function() {
    return Object.keys(assignments);
  }

  Object.freeze(that);
  return that;
}

