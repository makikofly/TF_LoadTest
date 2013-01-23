NUM=`ps aux | grep 'serverPort=8002' | grep -v 'grep' | wc -l`
if [$NUM -gt 0] ; then
	echo "Running pocess found!"
	kill `ps aux | grep 'redisServerLoadTest' | grep -v 'grep' | awk '{print $2}'`
fi
