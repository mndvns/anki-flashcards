@dev:
  clear && just run
  npx -y chokidar-cli \
    "src/*.ts,flashcards/*.md,flashcards/.tags.yaml" \
    --ignore "flashcards/*.json,flashcards/*.html" \
    --command "clear && just run"

run:
  node \
    --no-warnings \
    --experimental-modules \
    --experimental-specifier-resolution=node \
    --loader=ts-node/esm \
    ./src/parse.ts

tags:
  FIRST=; \
  cd flashcards; \
  ls *.tags.json | \
  while read f; do \
    $FIRST && echo; \
    $FIRST || FIRST=1; \
    LABEL=$(echo $f | cut -d '.' -f1); \
    TAGS=$(cat $f | tr -d '"' | tr -d '[' | tr -d ']' | tr , '\n' | sort | xargs printf "\n  %s"); \
    echo "$LABEL$TAGS"; \
  done

serve:
  serve flashcards

clean:
  rm -rf flashcards/*.{json,html}

reset:
  rm -rf node_modules package-lock.json
