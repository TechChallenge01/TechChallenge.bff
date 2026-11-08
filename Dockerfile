# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build .NET BFF
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/BFF/BFF.csproj src/BFF/
RUN dotnet restore src/BFF/BFF.csproj
COPY src/ src/
# Copy React build output into wwwroot
COPY --from=frontend-build /frontend/dist src/BFF/wwwroot/
WORKDIR /src/src/BFF
RUN dotnet publish BFF.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BFF.dll"]
