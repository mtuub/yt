name=Horoscope
value=$(echo "The following compositions are available:

Horoscope     24      1920x1080      2304 (96.00 sec)
Horoscope2    24      1920x1080      2880 (120.00 sec)" | awk -v name="Horoscope" '$1==name {print $4}')
echo $value