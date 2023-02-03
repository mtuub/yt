output=$(npx remotion compositions remotion/src/index.tsx Horoscope) 
  value=$(echo "$output" | awk -v name="$name" '$1==name {print $4}' | tail -n 1)
  echo $value
  echo "total_frames=$value" >> $GITHUB_OUTPUT