NUM=`ps aux | grep 'redisServerLoadTest' | grep -v 'grep' | wc -l`
if [ $NUM -gt 0 ] ; then
	echo "Running pocess found!"
	kill `ps aux | grep 'redisServerLoadTest' | grep -v 'grep' | awk '{print $2}'`
else
	echo "Process not found."
fi
