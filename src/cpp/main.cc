#include<napi.h>
#include<Windows.h>
#include<stdio.h>
#include<iostream>

Napi::Value createConsole(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();
	FreeConsole();
	if (AllocConsole()) {
		SetConsoleOutputCP(65001);
		freopen("conout$", "w", stdout);
		freopen("conout$", "r", stdin);
		return Napi::Boolean::New(env, true);
	}
	return Napi::Boolean::New(env, false);
}

Napi::Value Print(const Napi::CallbackInfo& info) {
	for (int i = 0; i < info.Length();i++) {
		std::cout << info[i].ToString().Utf8Value();
	}
	return Napi::Number::New(info.Env(), 1);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set("createConsole", Napi::Function::New(env, createConsole));
	exports.Set("print", Napi::Function::New(env, Print));
	return exports;
}

NODE_API_MODULE(LiteloaderZMLearn, Init)