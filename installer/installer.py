import os
from os import path
import colorama
import sys


def pause(code=0):
    print("按Enter退出")
    input()
    exit(code)


cwd = os.getcwd()

print("感谢您选择"+colorama.Style.BRIGHT+"Liteloader" +
      colorama.Fore.LIGHTRED_EX+"ZMLearn"+colorama.Style.RESET_ALL)
exepath = input(
    "将『掌门1对1辅导.exe』可执行文件或『掌门1对1辅导』桌面快捷方式拖到本窗口;\n在下方出现一串文件地址后按下Enter键即可自动安装。\n地址：")

if not path.exists(exepath):
    print((colorama.Fore.LIGHTRED_EX+"路径{}不存在" +
          colorama.Style.RESET_ALL).format(exepath))
    pause()
if exepath.endswith(".lnk"):
    if not sys.platform.startswith("win"):
        print("非Windows平台不可使用lnk文件！按Enter退出。")
        pause()
    import pylnk3
    if pylnk3.parse(exepath).path:
        exepath = pylnk3.parse(exepath).path
        print("正在使用快捷方式，真实路径：", exepath)
    else:
        print("快捷方式路径无效。")
        pause()


rootPath = path.abspath(path.join(str(exepath), ".."))


def renameAndInstall(d: str, f: str):
    if (path.isfile(path.join(d, "_"+f))):
        os.remove(path.join(d, f))
        os.rename(path.join(d, "_"+f), path.join(d, f))
        print("存在{}，替换以覆盖安装。".format(f))
    os.rename(path.join(d, f), path.join(d, "_"+f))
    with open(path.join(d, f), "w") as file:
        file.write('//LiteloaderZMLearn\nrequire(String.raw`{}`);\nrequire("./_{}")'.format(
            path.abspath(path.join(cwd, "dist", f)), f))
        file.close()
    print("安装{}完成。" .format(f))


renameAndInstall(path.join(rootPath, "resources/app/src/"), "index.js")
renameAndInstall(
    path.join(rootPath, "resources/app/src/renderer/preload"), "preload.js")
input("安装完成！按下Enter退出。")
