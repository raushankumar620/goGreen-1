import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// 🔁 New date range: 1 Jan 2022 → 1 July 2025
const START_DATE = moment("2023-01-01");
const END_DATE = moment("2024-12-30");

const git = simpleGit();

const makeCommits = (n) => {
  if (n === 0) return git.push();

  const x = random.int(0, END_DATE.diff(START_DATE, "weeks"));
  const y = random.int(0, 6); // 0 to 6 days

  const date = START_DATE.clone().add(x, "w").add(y, "d");

  if (date.isAfter(END_DATE)) return makeCommits(n);  

  const formattedDate = date.format();
  console.log("Committing at:", formattedDate);

  const data = { date: formattedDate };

  // ✅ Ensure write is finished before commit
  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }

    git.add([path])
      .commit(formattedDate, { "--date": formattedDate }, () => {
        makeCommits(n - 1);
      });
  });
};

// Start the process with a specified number of commits
makeCommits(2000); // You can change this number to create more or fewer commits

