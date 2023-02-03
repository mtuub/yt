name=Horoscope
output=$(echo "The following compositions are available:

Horoscope2    24      1920x1080      2880 (120.00 sec)
Horoscope     24      1920x1080      2304 (96.00 sec)")

value=$(echo "$output" | awk -v name="$name" '$1==name {print $4}' | tail -n 1)
echo $value
