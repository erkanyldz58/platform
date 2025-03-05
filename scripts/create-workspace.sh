cd ./dev/tool
rushx run-local create-account dxdiagyldz@gmail.com -p 1234 -f Erkan -l Yıldız # Create account
rushx run-local create-workspace Kubik email:dxdiagyldz@gmail.com
rushx run-local configure Kubik --list --enable '*' # Enable all modules, even if they are not yet intended to be used by a wide audience.
rushx run-local assign-workspace dxdiagyldz@gmail.com Kubik # Assign workspace to user.