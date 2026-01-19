# 2nd_pjt
AWS EC2 환경에서 3Tier 통신을 통한 웹서비스 개발 구현

## local 실행 명령어
### backend
```
$ gradlew bootRun --args="--spring.profiles.active=local"
```

### frontend
```
$ npm run start
```

## 배포를 위한 빌드 명령어
### backend
```
$ gradlew clean & gradlew build
```

### frontend
- 실행 전 build 폴더 통째 권장
```
$ npm run build
```