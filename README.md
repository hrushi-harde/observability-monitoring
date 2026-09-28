# To-Do App

The frontend is a static HTML/CSS/JavaScript app. The Docker image serves it using the Node.js HTTP server in `server.js`; it does not include or run the backend. The frontend currently calls the hosted API configured in `script.js`.

## Build and Test Locally

Run these commands from the repository root:

```powershell
docker build -t todo-app:local .
docker run --detach --name todo-app-test --publish 8080:8080 todo-app:local
curl.exe --fail http://localhost:8080/
curl.exe --fail http://localhost:8080/style.css
curl.exe --fail http://localhost:8080/script.js
docker rm --force todo-app-test
```

Alternatively, start the app with Compose:

```powershell
docker compose up --build
```

Open <http://localhost:8080>, then stop the service with `Ctrl+C` and run:

```powershell
docker compose down
```

Open <http://localhost:8080> to use the app. The container listens on port `8080`; set another host port in `--publish` if that port is already occupied, for example `--publish 8081:8080`.

To run the same smoke test used by CI:

```powershell
docker run --detach --name todo-app-test --publish 8080:8080 todo-app:local
try {
	curl.exe --fail --retry 10 --retry-connrefused --retry-delay 1 http://localhost:8080/ | Select-String "TO DO Application"
	curl.exe --fail http://localhost:8080/style.css
	curl.exe --fail http://localhost:8080/script.js
} finally {
	docker rm --force todo-app-test
}
```

## Amazon ECR CI/CD

`.github/workflows/ecr.yml` builds and smoke-tests the Docker image on pull requests and pushes to `main`. On pushes to `main`, it authenticates to AWS with GitHub Actions OIDC and pushes both the commit SHA tag and `latest` to ECR.

One-time AWS setup:

1. Create an ECR repository, for example `todo-app`.
2. Configure the AWS IAM OIDC identity provider for `token.actions.githubusercontent.com` if your AWS account does not already have it.
3. Create an IAM role trusted for the GitHub OIDC audience `sts.amazonaws.com` and subject `repo:hrushikesh-harde/todo-app:ref:refs/heads/main`.
4. Grant that role `ecr:GetAuthorizationToken` on `*` and these actions on the ECR repository: `ecr:BatchCheckLayerAvailability`, `ecr:CompleteLayerUpload`, `ecr:InitiateLayerUpload`, `ecr:PutImage`, and `ecr:UploadLayerPart`.
5. In GitHub repository settings, add the Actions secret `AWS_ROLE_TO_ASSUME` containing the role ARN, and the Actions variables `AWS_REGION` and `ECR_REPOSITORY` containing your AWS region and ECR repository name.

The published image is available as `<account-id>.dkr.ecr.<region>.amazonaws.com/<repository>:<commit-sha>` and `:latest`.