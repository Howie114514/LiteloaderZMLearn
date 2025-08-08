{
    "targets": [
        {
            "target_name": "LiteloaderZMLearn",
            "arch": "ia32",
            "sources": ["src/cpp/main.cc"],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            'defines': [
                'NOMINMAX',
                'UNICODE',
                'WIN32_LEAN_AND_MEAN',
                "NODE_ADDON_API_DISABLE_CPP_EXCEPTIONS"
            ],
        }
    ]
}
