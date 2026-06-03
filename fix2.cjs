const fs = require('fs');
let file = "src/store/useResumeStore.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
`          }),
            },
          })),
        updateJobDescription: (jd) =>`,
`          }),
        updateJobDescription: (jd) =>`
);

fs.writeFileSync(file, content);
