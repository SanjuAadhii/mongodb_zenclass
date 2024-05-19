// Find all the topics and tasks which are thought in the month of October
db.tasks.aggregate([
    {
      $match: {
        deadline: {
          $gte: ISODate("2020-10-01"),
          $lte: ISODate("2020-10-31"),
        },
      },
    },
    {
      $lookup: {
        from: "topics",
        localField: "topic_id",
        foreignField: "topic_id",
        as: "topic",
      },
    },
    {
      $unwind: "$topic",
    },
    {
      $project: {
        _id: 0,
        task_name: 1,
        topic_name: "$topic.name",
      },
    },
  ]);
  //Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
  
  db.company_drives.find({
    drive_date: {
      $gte: ISODate("2020-10-15"),
      $lte: ISODate("2020-10-31"),
    },
  });
  //Find all the company drives and students who are appeared for the placement.
  
  db.company_drives.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "drive_id",
        foreignField: "drive_id",
        as: "students",
      },
    },
  ]);
  // Find the number of problems solved by the user in codekata
  
  db.codekata.aggregate([
    {
      $match: { user_id: 2 },
    },
    {
      $group: {
        _id: "$user_id",
        total_problems_solved: { $sum: 1 },
      },
    },
  ]);
  // Find all the mentors with who has the mentee's count more than 15
  db.mentors.find({ mentee_count: { $gt: 15 } });
  // Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
  db.users.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "user_id",
        foreignField: "user_id",
        as: "tasks",
      },
    },
    {
      $match: {
        "tasks.deadline": {
          $gte: ISODate("2020-10-15"),
          $lte: ISODate("2020-10-31"),
        },
        attendance_status: "absent",
        tasks: { $size: 0 },
      },
    },
    {
      $count: "absent_users_with_no_tasks",
    },
  ]);