"""Settings, read from the environment and the repository's .env, where the engine key lives."""

from pathlib import Path

from pydantic_settings import BaseSettings

REPO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    pets_root: str = "../TRUSTED_PETS_PROVING_GROUND_2026"
    pets_engine_key: str = ""
    workspace_dir: str = "workspace"
    cors_origins: list[str] = ["http://localhost:5174"]
    max_upload_mb: int = 200

    model_config = {"env_file": (REPO_ROOT / ".env", ".env"), "extra": "ignore"}

    def resolve(self, value: str) -> Path:
        """Relative paths count from the repository root, wherever the server starts."""
        path = Path(value)
        return path if path.is_absolute() else (REPO_ROOT / path).resolve()

    @property
    def package_root(self) -> Path:
        return self.resolve(self.pets_root)

    @property
    def workspace(self) -> Path:
        return self.resolve(self.workspace_dir)


settings = Settings()
