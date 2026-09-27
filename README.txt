ENDGAME Loading Screen

Files:
- index.html
- style.css
- app.js
- background.mp4

Free hosting:
1. Upload all four files to the root of a GitHub Pages / Cloudflare Pages site.
2. Open the public URL and make sure the video autoplays.
3. Put that public URL into your MachoCreateDui(...) call.

Recommended Lua flow:

CreateThread(function()
    local dui = MachoCreateDui("YOUR_PUBLIC_URL_HERE")
    MachoShowDui(dui)

    Wait(4300)

    MachoDestroyDui(dui)
    CreateMenu()
end)

The supplied video is about 4 seconds long, so 4300 ms gives the page time to finish its fade.
