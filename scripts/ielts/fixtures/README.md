# Grading fixtures

Files here are the only way to tell whether a change to the grading prompt made
it better or just different. Each fixture is one JSON file:

```json
{
  "taskType": "task2",
  "prompt": "The exact question the essay answers.",
  "essay": "The candidate's full text, unedited.",
  "bands": {
    "task_response": 6.0,
    "coherence": 6.0,
    "lexical": 6.5,
    "grammar": 5.5,
    "overall": 6.0
  },
  "source": "Where the band came from, so it can be checked later."
}
```

`bands` is optional. Without it the fixture still works for `--consistency`,
which measures whether repeated grades of the same essay agree. Only fixtures
that carry `bands` count toward `--accuracy`.

## Where the bands must come from

Only use essays whose band was published by the people who set the exam or by
a named examiner, and record that in `source`. Cambridge IELTS books, the
official IELTS and British Council sites, and IDP sample answers all publish
model answers with bands. Do not invent a band, and do not copy one from a blog
that does not say who marked it: a wrong ground truth is worse than none,
because it makes a correct grader look broken.

Aim for 10 to 15 fixtures spread across bands 5.0 to 7.5. A set clustered at
one band cannot show whether the grader discriminates.

## Running

```bash
npm run ielts:eval -- --consistency --runs 3
npm run ielts:eval -- --accuracy
```

Run both before and after any prompt or model change, and record the numbers in
`docs/ielts/TECH-DESIGN.md` §10.
