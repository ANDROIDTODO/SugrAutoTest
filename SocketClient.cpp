
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <pthread.h>
 
void *recvsocket(void *arg)//接收client端socket数据的线程
{
	int st = *(int *)arg;
	char s[1024];
 
	while(1)
	{
		memset(s, 0, sizeof(s));
		int rc = recv(st, s, sizeof(s), 0);
		if (rc <= 0)//如果recv返回小于等于0，代表socket已经关闭或者出错了
			break;
		printf("%s\n", s);
 
	}
	return NULL;
}
 
void *sendsocket(void *arg)//向client端socket发送数据的线程
{
	int st = *(int *)arg;
	char s[1024];
 
	while(1)
	{
		memset(s, 0, sizeof(s));
		read(STDIN_FILENO, s, sizeof(s));//从键盘读取用户输入信息
		send(st, s, strlen(s), 0);
	}
	return NULL;
}
 
int main(int arg, char *args[])
{
	std::string ip = "127.0.0.1"; 	 
	int port = 9201;
	int st = socket(AF_INET, SOCK_STREAM, 0); //初始化socket，
 
	struct sockaddr_in addr; //定义一个IP地址的结构
	memset(&addr, 0, sizeof(addr));
	addr.sin_family = AF_INET; //设置结构地址类型为TCP/IP地址
	addr.sin_port = htons(port); //指定一个端口号：8080，htons:将short类型从host字节类型到net字节类型转化
	addr.sin_addr.s_addr = inet_addr(ip.c_str()); //将字符串类型的IP地址转化为int，赋给addr结构成员.
 
	//调用connect连接到结构addr指定的IP地址和端口号
	if (connect(st, (struct sockaddr *) &addr, sizeof(addr)) == -1)
	{
		printf("connect failed %s\n", strerror(errno));
		return EXIT_FAILURE;
	}
 
	pthread_t thrd1, thrd2;
	pthread_create(&thrd1, NULL, recvsocket, &st);
	pthread_create(&thrd2, NULL, sendsocket, &st);
	pthread_join(thrd1, NULL);
	pthread_join(thrd2, NULL);
	close(st); //关闭socket
	return EXIT_SUCCESS;
 
}
