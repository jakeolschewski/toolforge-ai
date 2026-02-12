#!/bin/bash

echo "🤖 Attempting automated browser assistance..."
echo ""

# Open Supabase token page
open "https://supabase.com/dashboard/account/tokens"

echo "Waiting for page to load..."
sleep 5

# Try to use AppleScript to interact with Safari
osascript <<EOF 2>/dev/null
tell application "Safari"
    activate
    delay 2

    -- Try to get the current URL to verify we're on the right page
    set currentURL to URL of current tab of window 1

    if currentURL contains "supabase.com/dashboard/account/tokens" then
        -- Page is loaded
        return "ready"
    else
        return "wrong_page"
    end if
end tell
EOF

RESULT=$?

if [ $RESULT -eq 0 ]; then
    echo "✅ Browser is on the tokens page"
    echo ""
    echo "Please:"
    echo "  1. Click 'Generate New Token' in the browser"
    echo "  2. Name it 'ToolForge Setup'"
    echo "  3. Click 'Generate token'"
    echo "  4. The token will appear - COPY IT"
    echo ""
    echo "The token will be automatically detected from your clipboard..."
    sleep 2

    # Wait for something to appear in clipboard
    echo "Waiting for token in clipboard (paste it when ready)..."
    INITIAL_CLIPBOARD=$(pbpaste)

    for i in {1..60}; do
        sleep 1
        CURRENT_CLIPBOARD=$(pbpaste)

        # Check if clipboard changed and looks like a Supabase token (starts with sbp_)
        if [ "$CURRENT_CLIPBOARD" != "$INITIAL_CLIPBOARD" ] && [[ "$CURRENT_CLIPBOARD" == sbp_* ]]; then
            echo ""
            echo "✅ Token detected in clipboard!"
            echo "$CURRENT_CLIPBOARD"
            export SUPABASE_TOKEN="$CURRENT_CLIPBOARD"

            # Save to a temp file for the main script to use
            echo "$CURRENT_CLIPBOARD" > /tmp/supabase_token.txt
            echo "✅ Token saved!"
            exit 0
        fi

        echo -n "."
    done

    echo ""
    echo "⏱ Timeout waiting for token"
    exit 1
else
    echo "⚠️  Could not automate browser - please use manual method"
    exit 1
fi
EOF

chmod +x /Volumes/JarvisSSD/toolforge-ai/auto-token-helper.sh
