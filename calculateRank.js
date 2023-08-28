const form = document.getElementById("infoForm");
const outputDiv = document.getElementById("outputDiv");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const allCommit = document.querySelector(
    'input[name="allCommit"]:checked'
  ).value;
  const commits = parseFloat(document.getElementById("commits").value);
  const prs = parseFloat(document.getElementById("prs").value);
  const issues = parseFloat(document.getElementById("issues").value);
  const reviews = parseFloat(document.getElementById("reviews").value);
  const stars = parseFloat(document.getElementById("stars").value);
  const followers = parseFloat(document.getElementById("followers").value);

  function calcRank(
    allCommit,
    commits,
    prs,
    issues,
    reviews,
    stars,
    followers
  ) {
    const COMMITS_MEDIAN = allCommit ? 1000 : 250,
      COMMITS_WEIGHT = 2;
    const PRS_MEDIAN = 50,
      PRS_WEIGHT = 3;
    const ISSUES_MEDIAN = 25,
      ISSUES_WEIGHT = 1;
    const REVIEWS_MEDIAN = 2,
      REVIEWS_WEIGHT = 1;
    const STARS_MEDIAN = 50,
      STARS_WEIGHT = 4;
    const FOLLOWERS_MEDIAN = 10,
      FOLLOWERS_WEIGHT = 1;

    const TOTAL_WEIGHT =
      COMMITS_WEIGHT +
      PRS_WEIGHT +
      ISSUES_WEIGHT +
      REVIEWS_WEIGHT +
      STARS_WEIGHT +
      FOLLOWERS_WEIGHT;

    const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

    const rank =
      1 -
      (COMMITS_WEIGHT * exponential_cdf(commits / COMMITS_MEDIAN) +
        PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN) +
        ISSUES_WEIGHT * exponential_cdf(issues / ISSUES_MEDIAN) +
        REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN) +
        STARS_WEIGHT * log_normal_cdf(stars / STARS_MEDIAN) +
        FOLLOWERS_WEIGHT * log_normal_cdf(followers / FOLLOWERS_MEDIAN)) /
        TOTAL_WEIGHT;

    const level = LEVELS[THRESHOLDS.findIndex((t) => rank * 100 <= t)];

    return { level, percentile: rank * 100 };
  }

  function exponential_cdf(x) {
    return 1 - 2 ** -x;
  }

  function log_normal_cdf(x) {
    // approximation
    return x / (1 + x);
  }

  const rankResult = calcRank(
    allCommit,
    commits,
    prs,
    issues,
    reviews,
    stars,
    followers
  );

  const outputText = `Level: ${rankResult.level}<br>Percentile: ${rankResult.percentile}%`;
  outputDiv.innerHTML = outputText;
});
