import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { isInvocationNode } from 'features/nodes/types/invocation';
import { useMemo } from 'react';

export const useNodeLabel = (nodeId: string) => {
  const selector = useMemo(
    () =>
      createMemoizedSelector(stateSelector, ({ nodes }) => {
        const node = nodes.nodes.find((node) => node.id === nodeId);
        if (!isInvocationNode(node)) {
          return false;
        }

        return node.data.label;
      }),
    [nodeId]
  );

  const label = useAppSelector(selector);
  return label;
};
