# 获取当前时间并格式化版本号
VERSION := $(shell TZ="Asia/Shanghai" date +"%y.%m%d.%H%M")


update-version:
	@echo "Updating package.json version to $(VERSION)"
	@node -e "const fs = require('fs'); \
		const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
		pkg.version = '$(VERSION)'; \
		fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
# 提交版本变更到Git
push-version: update-version
	@echo "Committing version change"
	git add .
	git commit -m "bump version to v$(VERSION)"
	git push

# 创建并推送标签
push-tag: push-version
	@echo "Creating and pushing tag v$(VERSION)"
	git tag v$(VERSION)
	git push origin v$(VERSION)

# 创建并推送标签
dev: 
	npm run dev

deploy: update-version
	npm run deploy
