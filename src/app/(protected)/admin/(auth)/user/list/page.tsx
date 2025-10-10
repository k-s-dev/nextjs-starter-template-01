import { getUsers } from "@/lib/dataModels/auth/user/dataAccess";
import { routes } from "@/lib/utils/routeMapper";
import { UserTable } from "@/lib/dataModels/auth/user/ui/UserTable";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import LinkButton from "@/lib/components/LinkButton";
import AdminFormHeaderContainer from "@/lib/features/admin/ui/form/AdminFormHeaderContainer";
import { MODEL_NAME } from "@/lib/dataModels/auth/user/definitions";

export default async function Page() {
  const sessionUser = await getSessionUser();
  const users = await getUsers({}, "client", sessionUser);

  return (
    <div>
      <AdminFormHeaderContainer modelName={MODEL_NAME} mode="list">
        <LinkButton href={routes.admin.user.create} color="blue.1" fz="lg">
          Create User
        </LinkButton>
      </AdminFormHeaderContainer>
      <UserTable users={users} />
    </div>
  );
}
