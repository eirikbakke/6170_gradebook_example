/**
 * Install a GradeWidget in the specified DOM container. A GradeWidget is a user
 * interface for editing Gradebook data.
 *
 * @param domContainer a jQuery wrapper around a single empty div element to
 *        install the GradeWidget in.
 * @param {Gradebook} gradebook the Gradebook object to use as a model for the
 *        data being displayed and edited by this GradeWidget.
 */
GradeWidget_install =
    function(domContainer, gradebook)
{
  var dropdownElm = $("<select>");
  var tableElm = $("<table>");
  $.each(gradebook.getAssignments(), function (index, value) {
    dropdownElm.append($("<option>", { "value": value, text: value }));
  });
  domContainer.append($("<h2>Grades by Assignment</h2>"));
  domContainer.append(dropdownElm);
  domContainer.append(tableElm);
  var gradeInputElm = $("<input type='number'>");
  var currentlyEditedRowKey = null;
  var acceptCurrentEdit = function() {
    if (currentlyEditedRowKey !== null) {
      var student = currentlyEditedRowKey;
      currentlyEditedRowKey = null;
      var assignment = dropdownElm.val();
      var gradeInput = gradeInputElm.val();
      if (gradeInput.length > 0) {
        gradebook.setGrade(student, assignment, parseInt(gradeInput));
      }
      rebuild_table();
    }
  };
  gradeInputElm.keydown(function (evt) {
    // Enter or tab keys.
    if (evt.keyCode === 13 || evt.keyCode === 9) {
      // Avoid the default focus-traversing behavior of the tab key.
      evt.preventDefault();
      acceptCurrentEdit();
    }
  });

  var rebuild_table = function() {
    /* jQuery will automatically detach any listeners when an element is removed
    from the DOM. Use detach() to remove gradeInputElm without removing its
    listeners, since we'll be reusing it. See
    http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory . */
    gradeInputElm.detach();
    var newTableElm = $("<table class='GradeWidget'>");
    var dropdownValue = dropdownElm.val();
    var total = 0, N = 0;
    if (dropdownValue.length > 0) {
      $.each(gradebook.getStudents(), function (index, rowKey) {
        var grade = gradebook.getGrade(rowKey, dropdownValue);
        var tableRow = $("<tr>");
        tableRow.append($("<td>", { text: rowKey }));
        var gradeCell = $("<td>");
        if (rowKey !== currentlyEditedRowKey) {
          var gradeElm = $("<a>", { text: grade, href: "#" });
          gradeCell.append(gradeElm);
          gradeCell.click(function() {
            acceptCurrentEdit();
            currentlyEditedRowKey = rowKey;
            rebuild_table();
            if (gradeInputElm !== null) {
              gradeInputElm.select();
              gradeInputElm.focus();
            }
          });
        } else {
          gradeCell.append(gradeInputElm);
          gradeInputElm.val(grade);
        }
        tableRow.append(gradeCell);
        newTableElm.append(tableRow);
        total += grade; N++;
      });
      newTableElm.append($("<tr class='avg'><td>Average</td><td>" +
        (total / N).toFixed(0) + "</td></tr>"));
    }
    /* Replacing the entire DOM container with a new element every time a single
    change avoids convoluted update logic, but can disturb UI state such as
    scroll position, tooltips, keyboard focus etc. Various client libraries
    exist that avoid such problems (React, virtual-dom, Knockout etc.). */
    tableElm.replaceWith(newTableElm);
    tableElm = newTableElm;
  }

  rebuild_table();
  dropdownElm.change(rebuild_table);
}

