build:
  node \
    --no-warnings \
    --experimental-modules \
    --experimental-specifier-resolution=node \
    --loader=ts-node/esm \
    ./src/parse.ts

serve:
  test -f flashcards.html || just build
  open flashcards.html

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

clean:
  rm -rf flashcards/*.{json,html}
